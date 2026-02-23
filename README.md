Foundation Demo

Playwright and TypeScript, Page Object Model.

What's covered:
The main purchase journey from login to completed order.
Login works and fails the right way, adding an item updates the cart, the checkout totals add up, and the confirmation screen appears at the end.

Setup:

npm install

npx playwright install

Running the tests:

npx playwright test

Headed mode if you want to watch it run:

npx playwright test --headed

Report:
npx playwright show-report

To Do

With extra time a few more things I would add/change:

1) Credentials and test data — Login details and checkout info are hardcoded at the moment. Normally credentials would sit in an .env file kept out of source control, and test data like names and postcodes would live in one shared location rather than being repeated across tests.

2) storageState for login — Each test logs in from scratch ideally this would not be used at scale.

3) Test Users — locked_out_user, problem_user, and performance_glitch_user are all available and I would add extra tests to cover these.

4) Remove from cart — Adding is covered, removing isn’t. It’s a short flow but has its own edge cases and state changes worth validating.

5) Stock sorting — I’d start with price sorting. From experience its easy to break and easy to miss in a manual testing.

6) GitHub Actions — Run the suite on push and publish the Playwright report.
