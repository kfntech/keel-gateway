# Keel Gateway

This project is not affiliated with keel.sh in any capacity.

The docker image helps translate webhook calls from Aliyun (阿里云) docker repository into the format accepted by Keel thus removing the need to use Webhook Relay in a private setting.

For security reasons, you should still use Webhook Relay when using public endpoint.

This project uses Openresty (NGINX with a custom LUA module) to manipulate the POST request received and converts it into correct format for Keel consumption

## Quick Start

Edit the Keel deployment file (YAML) with the following:

1. Internalise existing service
    ```
    ...

    apiVersion: v1
    kind: Service
    metadata:
    name: keel
    namespace: "keel"
    labels:
        app: keel
    spec:
    type: LoadBalancer <-- Remove this
    ports:
    - port: 9300
        targetPort: 9300
        protocol: TCP
        name: keel
    selector:
        app: keel
    sessionAffinity: None

    ...
    ```

2. Add an additional service for the gateway
    ```
    ...

    apiVersion: v1
    kind: Service
    metadata:
    name: gateway
    namespace: "keel"
    labels:
        app: gateway
    spec:
    type: NodePort
    ports:
        - port: 80
        targetPort: 80
        protocol: TCP
        name: gateway
    selector:
        app: keel <-- Make sure this stays consistent with deployment

    ...
    ```

3. Add keel gateway docker image as container
    ```
    ...

    spec:
      serviceAccountName: keel
      containers:

        - name: gateway
          image: "kfntech/keel-gateway:latest"
          ports:
          - containerPort: 80

        - name: keel
          # Note that we use appVersion to get images tag.
          image: "keelhq/keel:latest"
          imagePullPolicy: Always

    ...
    ```

4. Deploy it
    ```
    kubectl apply -f keel.yaml
    kubectl get svc -n keel

    // You should end up with something like this

    NAME      TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE
    gateway   NodePort    10.103.225.97   <none>        80:30721/TCP   1m
    keel      ClusterIP   10.101.5.33      <none>        9300/TCP       1m
    ```

Verify that you can trigger container update with a POST request to http://localhost:30721/ with body that looks like this:
```
{
    "push_data": {
        "digest": "sha256:457f4aa83fc9a6663ab9d1b0a6e2dce25a12a943ed5bf2c1747c58d48bbb4917", 
        "pushed_at": "2016-11-29 12:25:46", 
        "tag": "latest"
    }, 
    "repository": {
        "date_created": "2016-10-28 21:31:42", 
        "name": "repoTest", 
        "namespace": "namespace", 
        "region": "cn-shenzhen", 
        "repo_authentication_type": "NO_CERTIFIED", 
        "repo_full_name": "namespace/image_name", 
        "repo_origin_type": "NO_CERTIFIED", 
        "repo_type": "PUBLIC"
    }
}
```
Replace "repo_full_name" value with your repo name (without the registry.cn-shenzhen.aliyuncs.com part) and "tag" value with your tag. Make sure the region is consistent with yours.