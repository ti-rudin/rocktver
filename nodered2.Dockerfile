FROM nodered/node-red
USER root

RUN npm install --unsafe-perm --no-update-notifier --no-fund
RUN npm install @node-red-contrib-themes/midnight-red

RUN npm install node-red-contrib-filter
RUN npm install node-red-contrib-redis
RUN npm install node-red-dashboard
RUN npm install node-red-node-ui-table
RUN npm install @notify.events/node-red
RUN npm install node-red-contrib-nexmo

WORKDIR /usr/src/node-red
