# Find Your HackathonMates - An app for finding a team when you wish to join hackathons & to find appropriate team members for your hackathon team

## Live link :

(will be updated sortly)

## Features :

1. At first Signup then, Login to view all the teams.

2. `Only the teams of which the logged in user is not a member is shown in the "Teams" Page`.

3. `Send Join Requests` to teams by simply clicking on the `"Apply"` button.

4. `Go to the TeamMates page to `"Invite"` team mates into your team (if you haven't already created a team then create one to Invite the team mates) and if the teammate is already into that team then, it won't send any invitation `.

5. `The application data (notification) is sent to the "Team admin's email"` & `The invitation data (notification) is sent to the "Reciever user's email"`.

6. After Joining the team, chat with team members `[go to the "/profile/myTeams" route to find all your teams, you can chat in a specific team chat after going to the "/profile/myTeams/[teamId]" route]`, add various links into your team links to add Github Link or Design Links etc.

[`Invite & Apply to join in real time`] 

[`Recieve all the notifications in real time`]


7. `View all the team members, remove any team member from team by clicking the "-" sign button (only admin can remove members)`

8. `Accept or Reject the join requests or invitations in real time` , view all types of requests in the `"/profile/joinRequests"` route.

9. View the `user's profile` & the `teams' description` from the `notifications` and the `chat` page

10. `Send attachments via group chat or team chat`

11. `Get real time new message notification update`

## Motivation:

I myself find it challenging to find any team mates whenever I want to join any hackathon.So, I wanted to create myself an app where hackathon participants can create their own team, find another team mate who fulfill the team's skill requirements, chat with members,have all the links related to hackathons inside their team for referrence.


`I know there are already many successful apps in the market, but I just built something what I want an app like this will be.`

**Inspiration** : <a href="https://hack-bud.vercel.app/" target="_blank" > `Hackbud` </a>

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
