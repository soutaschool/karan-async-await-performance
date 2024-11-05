# Async await document

## Application flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Server

    User->>Frontend: Clicks "Run Synchronous Requests"
    loop Synchronous Requests
        Frontend->>Server: Send Request (await)
        Server-->>Frontend: Response
        Frontend->>Frontend: Update Progress Bar
    end
    Frontend->>User: Display Time Taken

    User->>Frontend: Clicks "Run Asynchronous Requests"
    Frontend->>Server: Send All Requests Simultaneously
    par Asynchronous Requests
        Server-->>Frontend: Response
        Frontend->>Frontend: Update Progress Bar
    end
    Frontend->>User: Display Time Taken
```

## How it works

### Synchronous case

Use await to wait for each request to complete, then execute the next request in turn.

```typescript
for (let i = 0; i < TOTAL_REQUESTS; i++) {
   try {
    await axios.get(API_URL);
    setSyncProgress(((i + 1) / TOTAL_REQUESTS) * 100);
```

```mermaid
sequenceDiagram
    participant Frontend
    participant Server

    loop For each request
        Frontend->>Server: Send Request
        Server-->>Frontend: Response
        Frontend->>Frontend: Update Progress
    end
    Frontend->>Frontend: All Requests Completed
```

### Asynchronous case

Multiple requests are stored in an array of Promise and executed and waited for simultaneously with Promise.all().

```typescript
  const requests = [];
  for (let i = 0; i < TOTAL_REQUESTS; i++) {
   requests.push(
    axios
     .get(API_URL)
     .then(() => {
      setAsyncProgress((prev) => prev + 100 / TOTAL_REQUESTS);
```

```mermaid
sequenceDiagram
    participant Frontend
    participant Server

    par
        loop For each request
            Frontend->>Server: Send Request
        end
    and
        loop For each response
            Server-->>Frontend: Response
            Frontend->>Frontend: Update Progress
        end
    end
    Frontend->>Frontend: All Requests Completed
```

## Await

Once the Promise is fulfilled, execution resumes with the resolved value.
If the Promise is rejected, an exception is thrown.

```typescript
async function fetchData() {
  try {
    const response = await fetch("https://api.example.com/data");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}
```

```mermaid
sequenceDiagram
    participant AsyncFunction
    participant Promise

    AsyncFunction->>Promise: await Promise
    Note over AsyncFunction: Execution pauses here
    Promise-->>AsyncFunction: Returns result upon fulfillment
    AsyncFunction->>AsyncFunction: Resumes execution with result
```

## Performance

```mermaid
flowchart TB
    subgraph Synchronous
        StartS(Start) --> Request1S(Request 1)
        Request1S --> Wait1S(Wait 1)
        Wait1S --> Response1S(Response 1)
        Response1S --> UpdateProgress1S(Update Progress 1)
        UpdateProgress1S --> Request2S(Request 2)
        Request2S --> Wait2S(Wait 2)
        Wait2S --> Response2S(Response 2)
        Response2S --> UpdateProgress2S(Update Progress 2)
        UpdateProgress2S --> Request3S(Request 3)
        Request3S --> Wait3S(Wait 3)
        Wait3S --> Response3S(Response 3)
        Response3S --> UpdateProgress3S(Update Progress 3)
        UpdateProgress3S --> EndS(End)
        EndS --> DisplayTimeS(Display Time)
    end

    subgraph Asynchronous
        StartA(Start) --> SendAllA(Send All Requests)
        SendAllA --> WaitAllA(Wait All Responses)
        WaitAllA --> Response1A(Response 1)
        WaitAllA --> Response2A(Response 2)
        WaitAllA --> Response3A(Response 3)
        Response1A --> UpdateProgress1A(Update Progress 1)
        Response2A --> UpdateProgress2A(Update Progress 2)
        Response3A --> UpdateProgress3A(Update Progress 3)
        UpdateProgress1A --> EndA(End)
        UpdateProgress2A --> EndA(End)
        UpdateProgress3A --> EndA(End)
        EndA --> DisplayTimeA(Display Time)
    end

    StartS --> Synchronous
    StartA --> Asynchronous
```
