import ProfileNav from "@/components/ProfileNav"


const ProfileLayout = ({children}) => {
  return (
    <div id="my profile" className="flex gap-1">
     <ProfileNav/>
     <main> {children} </main>
    </div>
  )
}

export default ProfileLayout