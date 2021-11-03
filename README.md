# Migration Guide: from Twilio to CometChat

Read the full tutorial here: [**>> Migration Guide: from Twilio to CometChat**](https://www.cometchat.com/tutorials/#)

## Technology

This demo uses:

- Node.js
- Express.js
- Body-parser
- Cors
- Dotenv
- Request

## Running the demo

To run the demo follow these steps:

1. [Head to CometChat Pro and create an account](https://app.cometchat.com/signup)
2. From the [dashboard](https://app.cometchat.com/apps), add a new app called **"twilio-migration"**
3. Select this newly added app from the list.
4. From the Quick Start copy the **APP_ID, APP_REGION and AUTH_KEY**. These will be used later.
5. Also copy the **REST_API_KEY** from the API & Auth Key tab.
6. Navigate to the Users tab, and delete all the default users and groups leaving it clean **(very important)**.
7. Download the repository [here](https://github.com/hieptl/twilio-migration/archive/main.zip) or by running `git clone https://github.com/hieptl/twilio-migration.git` and open it in a code editor.
8. Create a file called **.envs** in the root folder of your project.
9. Import and inject your secret keys in the **.env** file containing your CometChat in this manner.

```js
COMETCHAT_APP_ID=xxx - xxx - xxx - xxx - xxx - xxx - xxx - xxx
COMETCHAT_APP_REAGION=xxx - xxx - xxx - xxx - xxx - xxx - xxx - xxx
COMETCHAT_AUTH_KEY=xxx - xxx - xxx - xxx - xxx - xxx - xxx - xxx
COMETCHAT_API_KEY=xxx - xxx - xxx - xxx - xxx - xxx - xxx - xxx
```
12. Install all the dependencies of the applicatoin by running
```js
npm install
```
13. Run the project with the following statement
```js
node index.js 
```
14. Make sure to include the .env file in your gitIgnore file from being exposed online.

Questions about running the demo? [Open an issue](https://github.com/hieptl/twilio-migration/issues). We're here to help ✌️

## Useful links

- 🏠 [CometChat Homepage](https://app.cometchat.com/signup)
- 🏠 [CometChat Widget](https://prodocs.cometchat.com/v2.1/docs/web-chat-widget)
- 🚀 [Create your free account](https://app.cometchat.com/apps)
- 📚 [Documentation](https://prodocs.cometchat.com)
- 👾 [GitHub](https://www.github.com/cometchat-pro)
