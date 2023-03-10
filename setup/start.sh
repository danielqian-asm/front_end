set -v


# Talk to the metadata server to get the project id
PROJECTID=$(curl -s "http://metadata.google.internal/computeMetadata/v1/project/project-id" -H "Metadata-Flavor: Google")
REPOSITORY="new-repo"

# Install logging monitor. The monitor will automatically pick up logs sent to
# syslog.
curl -s "https://storage.googleapis.com/signals-agents/logging/google-fluentd-install.sh" | bash
service google-fluentd restart &

# Install dependencies from apt
apt-get update
apt-get install -yq ca-certificates git build-essential supervisor

# Install nodejs
# mkdir /opt/nodejs
# curl https://nodejs.org/dist/v18.9.1/node-v18.9.1-linux-x64.tar.gz | tar xvzf - -C /opt/nodejs --strip-components=1
# ln -s /opt/nodejs/bin/node /usr/bin/node
# ln -s /opt/nodejs/bin/npm /usr/bin/npm
apt install curl sudo -y
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt update
apt install nodejs -y
apt install yarn -y
# Get the application source code from the Google Cloud Repository.
# git requires $HOME and it's not set during the startup script.
# export HOME=/root
# git config --global credential.helper gcloud.sh
# git clone https://source.developers.google.com/p/${PROJECTID}/r/${REPOSITORY} /opt/app/new-repo

# Install app dependencies

# mkdir -p /opt/app/new-repo
cd /opt/app/new-repo
yarn install

# # Create a nodeapp user. The application will run as this user.
# useradd -m -d /home/nodeapp nodeapp
# chown -R nodeapp:nodeapp /opt/app

# # Configure supervisor to run the node app.
# cat >/etc/supervisor/conf.d/node-app.conf << EOF
# [program:nodeapp]
# directory=/opt/app/new-repo
# command=npm start
# autostart=true
# autorestart=true
# user=nodeapp
# environment=HOME="/home/nodeapp",USER="nodeapp",NODE_ENV="production"
# stdout_logfile=syslog
# stderr_logfile=syslog
# EOF

# supervisorctl reread
# supervisorctl update