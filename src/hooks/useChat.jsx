import { useParams } from "next/navigation";
import { useMemo } from "react";

const useChat = () => {
  const params = useParams();
  const teamId = useMemo(() => params?.teamId || "", [params?.teamId]);
  const isActive = useMemo(() => !!teamId, [teamId]);
  return {
    isActive,
    teamId,
  };
};

export default useChat;
