---
layout: home
permalink: index.html
repository-name: eYY-co2060-sri-lanka-trip-advisor
title: Sri Lanka Trip Advisor – Interactive Tour Guide Web Application
---

[comment]: # "This is the standard layout for the project, but you can clean this and use your own template, and add more information required for your own project"

<!-- Once you fill the index.json file inside /docs/data, please make sure the syntax is correct. (You can use this tool to identify syntax errors)

Please include the "correct" email address of your supervisors. (You can find them from https://people.ce.pdn.ac.lk/ )

Please include an appropriate cover page image ( cover_page.jpg ) and a thumbnail image ( thumbnail.jpg ) in the same folder as the index.json (i.e., /docs/data ). The cover page image must be cropped to 940×352 and the thumbnail image must be cropped to 640×360 . Use https://croppola.com/ for cropping and https://squoosh.app/ to reduce the file size.

If your followed all the given instructions correctly, your repository will be automatically added to the department's project web site (Update daily)

A HTML template integrated with the given GitHub repository templates, based on github.com/cepdnaclk/eYY-project-theme . If you like to remove this default theme and make your own web page, you can remove the file, docs/_config.yml and create the site using HTML. -->

# Sri Lanka Trip Advisor – Interactive Tour Guide Web Application

<br>

# Team

| eNumber  | Name         | Email                                         |
| -------- | ------------ | ---------- |
| eXXXXXXX | Student Name | [student@email.com](mailto:student@email.com) |
| eXXXXXXX | Student Name | [student@email.com](mailto:student@email.com) |
| eXXXXXXX | Student Name | [student@email.com](mailto:student@email.com) |

---
<!-- Image (photo/drawing of the final hardware) should be here -->

<!-- This is a sample image, to show how to add images to your page. To learn more options, please refer [this](https://projects.ce.pdn.ac.lk/docs/faq/how-to-add-an-image/) -->

<!-- ![Sample Image](./images/sample.png) -->

#### Table of Contents
1. [Introduction](#introduction)
2. [Solution Architecture](#solution-architecture)
3. [Software Designs](#software-designs)
4. [Testing](#testing)
5. [Conclusion](#conclusion)
6. [Links](#links)

---

# 1. Introduction

## 1.1 Project Overview

Sri Lanka Trip Advisor is a web-based trip planning system designed to help tourists plan personalized travel experiences within Sri Lanka. The application allows users to enter their travel preferences such as:

* number of travel days
* budget level
* interests
* travel mode
* travel pace
* starting district

Based on these inputs, the system generates a **day-by-day travel itinerary**, provides **estimated travel costs**, and recommends **nearby attractions**.

The platform also allows users to:

* browse districts
* explore attractions
* view maps
* save generated trips

The project focuses on **Sri Lanka tourism**, covering **25 districts with curated attraction data**.

---

## 1.2 Real World Problem

Planning trips in Sri Lanka is often inefficient and confusing, especially for first-time visitors.

Tourists usually search across many sources such as:

* travel blogs
* YouTube videos
* Google Maps
* tourism websites

This creates several problems:

* information is scattered across multiple platforms
* travelers do not receive personalized itineraries
* no clear estimate of daily and total trip cost
* users cannot easily discover nearby attractions
* travel plans are managed manually using notes or screenshots

As a result, tourists spend excessive time planning their trips and may still end up with poorly organized travel schedules.

---

## 1.3 Proposed Solution

Our solution is a **centralized travel planning web application** that simplifies the entire trip planning process.

The system:

* generates **personalized itineraries**
* provides **budget estimates**
* shows **nearby attractions**
* integrates **Google Maps**
* allows **saving travel plans**

The itinerary generation uses a **deterministic rule-based algorithm** rather than AI to ensure predictable and consistent results.

---

## 1.4 Impact

The solution provides several benefits.

### For Tourists

* Faster trip planning
* Better budget management
* Easier discovery of nearby attractions

### For Tourism Industry

* Encourages exploration of multiple districts
* Promotes lesser-known attractions

### For Users

* Saves planning time
* Improves travel experience
* Provides organized trip plans

---

# 2. Solution Architecture

## 2.1 High Level Architecture Diagram

```text
+----------------------+
|      End User        |
|  Tourist / Traveler  |
+----------+-----------+
           |
           v
+-------------------------------+
| React Frontend (Vite)         |
| - Home Page                   |
| - Login / Signup              |
| - Trip Planner                |
| - Districts / Attractions     |
| - Nearby Attractions          |
| - Saved Trips                 |
+---------------+---------------+
                |
                v
+---------------------------------------------+
| Firebase Services                           |
| - Firebase Authentication                   |
| - Firestore Database                        |
+----------------+----------------------------+
                 |
     +-----------+-----------+
     |                       |
     v                       v
+------------+       +----------------------+
| Firestore  |       | Browser APIs         |
| - users    |       | - Geolocation        |
| - districts|       +----------------------+
| - attractions
| - trips    |
+------------+
                 |
                 v
        +----------------------+
        | Google Maps Embed    |
        | + Maps external link |
        +----------------------+
```

---

## 2.2 Architecture Description

### Presentation Layer

The frontend is developed using **React with Vite**.
It provides the user interface for:

* authentication
* trip planning
* attraction browsing
* viewing itineraries
* nearby attraction discovery

---

### Application Logic Layer

Core application logic includes:

* itinerary generation
* attraction filtering based on interests
* travel time estimation
* budget calculation
* distance calculation using Haversine formula

---

### Backend Service Layer

Firebase provides backend services including:

* **Firebase Authentication** for login
* **Firestore Database** for storing system data

Collections include:

* users
* districts
* attractions
* trips

---

### External Services

Google Maps embeds are used to display attraction locations without requiring an API key.

---

### Device APIs

The **Nearby Attractions feature** uses browser geolocation to determine the user's location and calculate distances to nearby attractions.

---

# 3. Software Designs

## 3.1 Design Goals

The system was designed with the following objectives:

* simple MVP implementation
* modular architecture
* responsive user interface
* maintainable code structure
* secure user data access
* predictable itinerary generation

---

## 3.2 Technology Stack

| Technology              | Purpose                           |
| ----------------------- | --------------------------------- |
| React                   | Frontend framework                |
| Vite                    | Development server & build tool   |
| Firebase Authentication | User login system                 |
| Firestore               | NoSQL cloud database              |
| Tailwind CSS            | Responsive UI styling             |
| Google Maps Embed       | Attraction location visualization |

---

## 3.3 Functional Modules

### 3.3.1 Authentication Module

Handles:

* email/password signup
* email/password login
* Google authentication
* logout functionality
* user profile storage

---

### 3.3.2 Trip Planner Module

This is the **core module** of the system.

#### Inputs

* number of days
* budget level
* interests
* start district
* travel mode
* pace

#### Processing

* determine number of stops per day
* prioritize attractions based on interests
* order attractions geographically
* calculate travel time
* estimate travel cost

#### Outputs

* day-by-day itinerary
* ordered attractions
* estimated cost

---

### 3.3.3 District Browsing Module

Users can browse:

* all 25 districts
* attractions within each district

Each district contains **5 attractions**.

---

### 3.3.4 Attraction Details Module

Displays:

* attraction name
* description
* category tags
* best visiting time
* transport options
* accommodation suggestions
* Google Maps embed

---

### 3.3.5 Nearby Attractions Module

Process:

1. User allows location access
2. System obtains latitude and longitude
3. Distance is calculated using **Haversine formula**
4. Nearest attractions are displayed

---

### 3.3.6 Saved Trips Module

Users can:

* save generated itineraries
* view saved trips
* reopen saved trip details

---

## 3.4 Data Design

Firestore database contains the following collections.

### users

Stores authenticated user information.

### districts

Stores district metadata.

### attractions

Stores attraction information including:

* district ID
* description
* categories
* coordinates
* map links

### trips

Stores user generated itineraries and preferences.

---

## 3.5 Routing Structure

```
/
/login
/signup
/plan
/trips
/trips/:id
/districts
/districts/:districtId
/attractions/:attractionId
/nearby
/profile
```

---

## 3.6 User Interface Design

UI design focuses on:

* mobile-first layout
* responsive components
* clear navigation
* interactive itinerary display

Key UI components include:

* navigation bar
* attraction cards
* planner forms
* itinerary display sections

---

## 3.7 Security Design

Security is implemented using Firebase rules.

* public read access for districts and attractions
* authenticated access for user trips
* owner-only read/write for trip data

---

# 4. Testing

## 4.1 Testing Strategy

Testing focused on:

* functional correctness
* system integration
* UI responsiveness
* edge case handling

---

## 4.2 Unit Testing

### Itinerary Generation

Verified:

* attraction selection based on interests
* correct stops per day
* proper itinerary ordering

Example:
A **3-day normal pace trip** generates **4 stops per day (12 stops total)**.

---

### Budget Estimation

Tested budget calculation rules including:

* food cost
* accommodation cost
* transport cost
* entry fees

Results matched expected calculations.

---

### Distance Calculation

Haversine distance calculations were verified using known coordinates.

---

## 4.3 Integration Testing

Tested interactions between:

* authentication and Firestore
* trip planner and database
* nearby feature and attraction dataset

---

## 4.4 UI Testing

Tested on:

* desktop
* tablet
* mobile devices

Ensured layouts remain responsive and functional.

---

## 4.5 Sample Test Cases

| Test ID | Feature         | Input                | Expected Output     | Result |
| ------- | --------------- | -------------------- | ------------------- | ------ |
| T01     | Signup          | valid email/password | account created     | Pass   |
| T02     | Google Login    | Google account       | user logged in      | Pass   |
| T03     | Trip Planner    | 2 days               | itinerary generated | Pass   |
| T04     | Budget Estimate | mid budget           | correct cost        | Pass   |
| T05     | Nearby          | geolocation enabled  | nearby attractions  | Pass   |

---

## 4.6 Summary of Results

Testing confirmed that:

* authentication works correctly
* itinerary generation follows rules
* attraction browsing functions properly
* nearby attraction feature works
* saved trips persist correctly
* responsive UI works across devices

---

# 5. Conclusion

## 5.1 Achievements

The project successfully implemented:

* personalized itinerary generation
* attraction browsing system
* nearby attraction discovery
* travel cost estimation
* trip saving functionality

---

## 5.2 Future Developments

Possible future improvements include:

* AI-based itinerary recommendations
* hotel and restaurant booking integration
* weather forecasting
* multilingual support
* user reviews and ratings
* tourism analytics dashboard

---

## 5.3 Commercialization Plans

The platform could evolve into a commercial tourism service through:

* partnerships with hotels and tour operators
* travel booking integrations
* sponsored attraction listings
* premium itinerary planning features

---

# 6. Links

### GitHub Repository

`https://github.com/your-repo`

### Live Deployment

`https://your-netlify-site.netlify.app`

### Project Documentation

`link to full report`

- [Project Repository](https://github.com/cepdnaclk/{{ page.repository-name }}){:target="_blank"}
- [Project Page](https://cepdnaclk.github.io/{{ page.repository-name}}){:target="_blank"}
- [Department of Computer Engineering](http://www.ce.pdn.ac.lk/)
- [University of Peradeniya](https://eng.pdn.ac.lk/)

[//]: # (Please refer this to learn more about Markdown syntax)
[//]: # (https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)
