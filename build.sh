react_container=$(docker image list | grep react | awk '{print $3}' | xargs)
docker rmi -f $react_container

api_container=$(docker image list | grep api | awk '{print $3}' | xargs)
docker rmi -f $api_container

cd ./client
npm install # If dependencies not yet installed
npm run build

redis-cli shutdown

cd ..
docker compose up