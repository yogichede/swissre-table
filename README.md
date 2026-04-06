# React Table with API Integration


This project demonstrates a simple table implementation with **Pagination**, **Filtering**, and **Sorting** features, all integrated with a dummy API response. It provides a clean and scalable approach to handling server-side data operations in React.

Additionally, **Web Worker** code has been added to the project. However, due to technical issues, the Web Worker is not yet fully integrated with the API. This section is a work in progress and will be updated once integration is complete.


# Problem Statement:
-	**Display 20,000+ records, with records with sorting, filtering, and row actions (Edit/Delete/Assign)**. 
-	**Records(data) and UI actions must be controlled based on permissions**
-	**On selecting(click) the row it will display the associated document(1500MB-1GB) data**

-	**view large documents efficiently and support operations: edit, split, merge, delete and add page-level comments** 

# Architecture: Based on give problem statement implementing the 3-Tier/layer Architecture 
 - **Frontend**:  will use React, Typescript, React Query (for caching)
 - **API Layer (GateWay)**: This layer is for Auth Apis, Claims service, Document service (with streaming) 
- B**ackend Service**: Role based Auth, claim Processing, Document storage (cloud using S3 or similar)  

# Solution:
-	I suggest **pagination** for this problem because data is huge(20k+) displaying this much data cause the issue in DOM rendering and hit the browser performance as well.

-	Still we can use react-virtualization/ react infinite scroll but here we have filter, sorting option it will allow to user to get the        required row/filed data based on the input so there is no need of rendering all the records and we using pagination on demand only we will call the API and get the response for selected page records.

-	We use debouncing to avoid the api request on every key stroke (filter purpose mainly)

-	user can optimize the per page records options as well(can change 10=>20 records per page)

-	Here we are using react query keeps the recent page cached for quick navigation (un necessary refetching). 
For RBAC: Will use Backend API flags to determine the current user can Edit/delete/update record and permission for row click as well (canEdit/canDelete/canSelectRow/canAssign etc.. we can create our own custom hook to determine what to show based on the flag)

- **To Load Document(1500MB-1GB)**: To load this kind of data and make UI responsive will use Web Workers here it will allow us to offload heavy parsing/streaming of large documents (1–1.5 GB) to a background thread, keeping the UI responsive it will help the non-blocking ui and streaming friendly. We will show progress along with % of completion, we can add the skelton loader, progress bar and cancel option(if requied) for better good User experience 

# View Document and Support (Edit/split/merge/delete): 
-	In client side  We will use Backend jobs with version checking. To manage comments per page will persist the data in DB and will fetch the data on demand(Per-page window).
-	While polling the job will show UI progress allows cancel/retry for long running tasks 
-	If page load fails, show per-page error and retry (Don’t kill entire document)

# Performance and scalability:
-	All business logics, heavy operations will handle in server side to make Client lighweight so that it will gives good UX and maintain the data/versioning is more easy 
-	Using react predefined hooks like UsecallBack and UseMemo to avoid the un necessary re-rendering and will use serverside pagination 
- **cache strategy**: short-lived with explicit invalidation on mutation; LRU eviction for documents.

## 🚀 Installation & Setup

Follow these steps to run the project locally:

1. Install dependencies  
   ```bash
   npm install
2. Start the development server 
   ```bash
   npm start
3. The application will be available at 
   ```bash
   http://localhost:3000

📖 **Features**-
- Server-side Pagination
- Server-side Filtering
- Server-side Sorting
- Integrated with a dummy API for demonstration
- Web Worker code (currently not integrated with API)


🛠 **Tech Stack**
- React.js
- Material-UI (MUI)
- Dummy API for data simulation
- Web Worker (planned API integration)

# NOTE: 
- I critically analyzed the case study, developed my own solution, and leveraged AI tools to articulate and present the idea with greater clarity and impact. 
