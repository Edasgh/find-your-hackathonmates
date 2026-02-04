import "./globals.css";
import { dbConn } from "@/lib/mongo";
import "react-toastify/dist/ReactToastify.css";
import { ConvexClientProvider } from "./ConvexClientProvider";

export const metadata = {
  title:
    "Find Your Hackathon Mates - Build your team for hackathons, connect with potential teammates,make project plans together",
  description:
    "An app to find hackathon teams, teammates,video chat with teammates,share project plans together,assign works to teammates.",
  keywords: [
    "find your hackathon mates",
    "hackathon teams",
    "find hackathon teams",
    "hackathon team builder",
    "build hackathon teams",
    "find hackathon teammates",
    "hackathon collaboration",
    "team matching for hackathons",
    "hackathon project planning",
    "hackathon networking",
    "hackathon team finder",
    "hackathon partner search",
    "hackathon team formation",
    "hackathon teamwork app",
    "developer matching",
    "coding team finder",
    "findYourHackathonMates",
    "find_Your_HackathonMates",
  ],
  openGraph: {
    title: "find_Your_HackathonMates",
    description: "Build your perfect hackathon team — faster.",
    url: "https://find-your-hackathonmates.onrender.com",
    siteName: "findYourHackathonMates",
    images: [
      {
        url: "/home.png",
        width: 1200,
        height: 630,
        alt: "FindYourHackathonMates – Hackathon Team Builder",
      },
    ],
    type: "website",
    twitter: {
      card: "summary_large_image",
      title: "find_Your_HackathonMates",
      description: "Build your perfect hackathon team — faster.",
      images: ["/home.png"],
    },
  },
};

const Layout = async ({ children }) => {
  return (
    <>
      <ConvexClientProvider>{children}</ConvexClientProvider>
    </>
  );
};

export default async function RootLayout({ children }) {
  await dbConn();
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "find_Your_HackathonMates",
              url: "https://find-your-hackathonmates.onrender.com",
              applicationCategory: "DeveloperTool",
              operatingSystem: "Web",
              description:
                "findYourHackathonMates helps users find hackathon teams, teammates, join teams, and collaborate in real time.",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "INR",
              },
            }),
          }}
        />
      </head>
      <body>
        <Layout children={children} />
      </body>
    </html>
  );
}
