import "./globals.css";
import Navbar from "@/components/Navbar";
import { dbConn } from "@/lib/mongo";
import { CredsProvider } from "@/hooks/useCreds";

export const metadata = {
  title: "Find Your Hackathon Mates - Build your team for hackathons, connect with potential teammates,make project plans together",
  description:
    "An app to find hackathon teammates,video chat with teammates,share project plans together,assign works to teammates.",
};

async function getUser() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/profile`, {
    cache: "no-store", // Disable caching for fresh data
    credentials: "include",
  });
  if (res.status!==200) return null;
  return res.json();
}


const Layout = async({children}) => {
  const user = await getUser();
  return (
    <>
      <Navbar />
      <CredsProvider initialUser={user}>{children}</CredsProvider>
    </>
  );
};

export default async function RootLayout({ children }) {
  await dbConn();
  return (
    <html lang="en">
      <body>
        <Layout children={children} />
      </body>
    </html>
  );
}

