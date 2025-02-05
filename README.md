# Find Your HackathonMates - An app for finding a team when you wish to join hackathons & to find appropriate team members for your hackathon team
**Introducing `Find Your HackathonMates` - An app for finding a team when you wish to join hackathons & to find appropriate team members for your hackathon team**


I myself find it challenging to find any team mates whenever I want to join any hackathon.So, I wanted to create myself an app where hackathon participants can create their own team, find another team mate who fulfill the team's skill requirements, chat with members,have all the links related to hackathons inside their team for referrence.

`I know there are already many successful apps in the market, but I just built something what I want an app like this will be.`

**Inspiration** : <a href="https://hack-bud.vercel.app/" target="_blank" > `Hackbud` </a>

## Live link : 
https://find-your-hackathonmates.onrender.com/

## Demo Video :
https://youtu.be/y1rbUe-5gpk

<a href="https://youtu.be/y1rbUe-5gpk" target="_blank" title="Click to watch" >
<img src="https://github.com/user-attachments/assets/77eb03bd-a2b0-4780-ac41-664fe2a31a8f"/ >
 </a>


## Features :

- `Search teams & team mates by a specific skill to fulfill your team's requirements`
- `Send applications to join to teams for your hackathons`
- `Invite team mates to join your team (if not already created, create one first) & won't send invitation if already a member of that team`
- `Send invitation & application to email`
- `Chat real time with team mates on "TeamChats" page,Send attachments , save links to your design etc in the team itself`
- `User friendly interface to navigate between pages`

## Challenges I faced :

1. I myself found it a bit difficult to understand the `"Next.js"` folder structure, how server-side rendering occurs here cause, this is my first time creating a full stack "Next.js" application (I made `"MERN"` Apps before but not the `"Next.js"` ones),
2. Since, it's my first full stack "Next.js" app so, It was pretty hard for me to understand how to configure server apis or setup socket servers in a "Next.js" app,
3. I'm using `"Nodemailer"` for the first time, so it took a bit longer time for me to understand how "Nodemailer" work and how to handle "Nodemailer" requests.
4. Deployment of this app was pretty challenging cause I was trying to deploy it in "vercel" at first but it doesn't support "socket.io" so, I finally was able to deploy it in "Render".

## Tech Stack :

1. `Next.js`;
2. Design : `CSS3`, `Tailwind CSS`, `FontAwesome Icons`, `React-Toastify`;
3. `MongoDb` (DataBase);
4. `Socket.io` (WebSocket integration);
5. `Nodemailer` (To send emails);
6. `Cloudinary` (To send attachments via chat)


## Future Feature Plans :
1. I plan to add video calling feature here so that team mates can discuss their project better
2. Users will be able to add their profile picture (instead of showing avatars)
3. I plan to make all the parts fully responsive
4. Oauth with github , google
