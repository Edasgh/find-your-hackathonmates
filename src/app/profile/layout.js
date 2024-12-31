import ProfileNav from "@/components/ProfileNav"


const ProfileLayout = ({children}) => {
  return (
    <div className="flex gap-1">
     <ProfileNav/>
     <main> {children} </main>
    </div>
  )
}

export default ProfileLayout