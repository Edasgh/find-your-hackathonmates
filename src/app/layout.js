import "./globals.css";
import Navbar from "@/components/Navbar";
import { dbConn } from "@/lib/mongo";
import { CredsProvider } from "@/hooks/useCreds";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



export const metadata = {
  title: "Find Your Hackathon Mates - Build your team for hackathons, connect with potential teammates,make project plans together",
  description:
    "An app to find hackathon teammates,chat with teammates,share project plans together,assign works to teammates.",
};

const Layout = async({children}) => {
  return (
    <>
      <CredsProvider>
        <Navbar />
        <ToastContainer position="top-center" theme="dark" />
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

