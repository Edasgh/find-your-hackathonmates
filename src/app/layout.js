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
 try {
   const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/profile`,{cache:"no-store"});
   if (res.status !== 200) throw new Error("Something went wrong!");
   return res.json();
 } catch (error) {
   console.log(error);
   return null;
 }
}


const Layout = async({children}) => {
  const user = await getUser();
  return (
    <>
      <CredsProvider initialUser={user}>
        <Navbar/>
        {children}
      </CredsProvider>
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

