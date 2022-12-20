# gcloud compute instances create $vmname --provisioning-model=SPOT --zone=$zone --no-address -q --machine-type=e2-small --network-interface=subnet=$mvpsubnet,no-address  --tags=allow-health-check,allow-iap-access
gcloud compute ssh $vmname --zone=$zone --command 'mkdir -p /opt/app/new-repo' -q
gcloud compute scp --recurse *  $vmname:/opt/app/new-repo --zone=$zone -q
gcloud compute ssh $vmname --zone=$zone --command 'sudo sh ./setup/start.sh' -q
# gcloud compute instances stop $vmname --zone=$zone
# #gcloud compute snapshots create $vmname-$BUILD --source-disk=$vmname --source-disk-zone=$zone --storage-location=us
# #gcloud compute images create $vmname-$BUILD --source-snapshot=$vmname-$BUILD --storage-location=us
# gcloud compute images create $vmname-$BUILD --source-disk=$vmname --storage-location=us --source-disk-zone=$zone
# gcloud compute instance-templates create $templatename  --source-instance=$vmname --source-instance-zone=$zone --configure-disk=device-name=persistent-disk-0,instantiate-from=custom-image,custom-image="projects/$PROJECT_ID/global/images/$vmname-$BUILD"
# gcloud compute instance-groups managed rolling-action start-update $instancegroup --version=template=$templatename --zone=$zone
# gcloud compute instances delete $vmname --zone=$zone
