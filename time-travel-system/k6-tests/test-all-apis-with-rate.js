import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';
import { SharedArray } from 'k6/data';

// Load data from CSV files
const destinations = new SharedArray('destinations', function () {
  return open('./data/destinations.csv')
    .split('\n')
    .slice(1)
    .map((line) => {
      const [destination, rate] = line.split(',');
      return { destination, rate: parseInt(rate, 10) };
    });
});

const artifacts = new SharedArray('artifacts', function () {
  return open('./data/artifacts.csv')
    .split('\n')
    .slice(1)
    .map((line) => {
      const [artifact, wizardLevel, rate] = line.split(',');
      return {
        artifact,
        wizardLevel: parseInt(wizardLevel, 10),
        rate: parseInt(rate, 10),
      };
    });
});

const potions = new SharedArray('potions', function () {
  return open('./data/potions.csv')
    .split('\n')
    .slice(1)
    .map((line) => {
      const [potion, ingredients, rate] = line.split(',');
      return { ingredients, rate: parseInt(rate, 10) };
    });
});

// Function to get random element based on rate
function getRandomElementWithRate(dataArray) {
  const weightedArray = dataArray.flatMap((item) =>
    Array(item.rate).fill(item),
  );
  return weightedArray[Math.floor(Math.random() * weightedArray.length)];
}

// Configuration
export const options = {
  stages: [
    { duration: '1m', target: 10 }, // Ramp up to 10 users
    { duration: '3m', target: 50 }, // Hold at 50 users
    { duration: '1m', target: 0 }, // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should complete below 500ms
    booking_success_rate: ['rate>0.99'], // 90% of bookings should succeed
    artifact_success_rate: ['rate>0.95'], // 95% of artifact checkouts should succeed
    potion_success_rate: ['rate>0.85'], // 85% of potion brewing should succeed
    api_errors: ['count==0'], // Ensure no API errors occur
  },
};

// Custom metrics
export const bookingSuccessRate = new Rate('booking_success_rate');
export const artifactSuccessRate = new Rate('artifact_success_rate');
export const potionSuccessRate = new Rate('potion_success_rate');

export const bookingResponseTime = new Trend('booking_response_time');
export const artifactResponseTime = new Trend('artifact_response_time');
export const potionResponseTime = new Trend('potion_response_time');
export const apiErrors = new Counter('api_errors'); // New counter for errors

// Main load test function
export default function () {
  // Test Booking API
  const randomDestination = getRandomElementWithRate(destinations).destination;
  const bookingRes = http.get(
    `http://localhost:3000/booking/create?destination=${randomDestination}`,
  );

  const bookingSuccess = check(bookingRes, {
    'Booking status is 200': (r) => r.status === 200,
  });

  if (!bookingSuccess) {
    apiErrors.add(1);
  }

  bookingSuccessRate.add(bookingSuccess);
  bookingResponseTime.add(bookingRes.timings.duration);
  sleep(1); // Simulate a think time

  // Test Artifact API
  const randomArtifact = getRandomElementWithRate(artifacts);
  const artifactRes = http.get(
    `http://localhost:3000/artifact/checkout?artifact=${randomArtifact.artifact}&wizardLevel=${randomArtifact.wizardLevel}`,
  );

  const artifactSuccess = check(artifactRes, {
    'Artifact status is 200': (r) => r.status === 200,
  });

  if (!artifactSuccess) {
    apiErrors.add(1);
  }

  artifactSuccessRate.add(artifactSuccess);
  artifactResponseTime.add(artifactRes.timings.duration);
  sleep(1); // Simulate a think time

  // Test Potion API
  const randomPotion = getRandomElementWithRate(potions).ingredients;
  const potionRes = http.get(
    `http://localhost:3000/potion/brew?ingredients=${encodeURIComponent(randomPotion)}`,
  );

  const potionSuccess = check(potionRes, {
    'Potion status is 200': (r) => r.status === 200,
  });

  if (!potionSuccess) {
    apiErrors.add(1);
  }

  potionSuccessRate.add(potionSuccess);
  potionResponseTime.add(potionRes.timings.duration);
  sleep(1); // Simulate a think time
}
