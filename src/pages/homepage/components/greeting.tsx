import { useGetUserInfo } from "@/api/endpoints/users/users.gen";

export function Greeting() {
  const { data: userData } = useGetUserInfo("me");

  // Create a user greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    let greeting = "Hello";

    if (hour < 12) {
      greeting = "Good morning";
    } else if (hour < 18) {
      greeting = "Good afternoon";
    } else {
      greeting = "Good evening";
    }

    const name =
      userData?.data.first_name ?? userData?.data.username ?? "there";

    return `${greeting}, ${name}`;
  };

  return <h1 className="text-3xl font-bold">{getGreeting()}</h1>;
}
