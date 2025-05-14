import "./globals.css";
import { dbConn } from "@/lib/mongo";
import "react-toastify/dist/ReactToastify.css";
import { ConvexClientProvider } from "./ConvexClientProvider";

export const metadata = {
  title:
    "Find Your Hackathon Mates - Build your team for hackathons, connect with potential teammates,make project plans together",
  description:
    "An app to find hackathon teammates,video chat with teammates,share project plans together,assign works to teammates.",
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
      <body>
        <Layout children={children} />
      </body>
    </html>
  );
}
