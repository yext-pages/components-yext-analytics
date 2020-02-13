# components-yext-analytics

## *DO NOT PUSH TO THIS REPO!*

This repo is only for backwards-compatibility to use the Yext Analytics component as a module on sites that don't support Yext components as node modules ("Componode"). The ONLY time this repo should be updated is if we need to update the analytics component for ALL sites.

#### How to generate a new release:
1. Make sure your computer is set up with an access token to clone https://www.npmjs.com/package/@yext/components-yext-analytics 
2. Clone this repo: https://github.com/yext-pages/YextAnalyticsUpgrade
3. Run the script `transpile-component.sh`
4. The script will generate a new release and upload it to this repo.
