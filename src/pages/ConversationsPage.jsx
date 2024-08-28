import { useEffect } from "react";
import mainStore from "../store/mainStore";
import { useNavigate } from "react-router-dom";

function ConversationsPage() {
  const { user } = mainStore();
  const nav = useNavigate();

  useEffect(() => {
    if (!user) {
      return nav("/");
    }
  });
  return (
    <div>
      <h2>Conversation Page</h2>
    </div>
  );
}

export default ConversationsPage;
