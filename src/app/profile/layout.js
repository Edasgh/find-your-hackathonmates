import ProfileNav from "@/components/ProfileNav"


const ProfileLayout = ({children}) => {
  return (
    <div title="my profile" className="flex gap-1">
     <ProfileNav/>
     <main> {children} </main>
    </div>
  )
}

export default ProfileLayout