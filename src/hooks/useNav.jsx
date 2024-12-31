import { faMessage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePathname } from 'next/navigation'
import React, { useMemo } from 'react'

const useNav = () => {
    const pathName = usePathname();
    const paths = useMemo(()=>[{
        name:"myTeams",
        href:"/profile/myTeams",
        icon:<FontAwesomeIcon icon={faMessage} />
        , 
        active:pathName.startsWith("/profile/myTeams")
    }],[pathName])
  return {
    paths
  }
}

export default useNav