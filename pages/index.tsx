import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { clearSession, verifySession } from "@/lib-server/services/session";

interface UserSession {
  id: string;
  email: string;
}

interface HomePageProps {
  session: UserSession | null;
}

const HomePage: React.FC<HomePageProps> = ({ session }) => {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">

      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Quiz App</h1>
        <div>
          {session ? (
            <div className="flex items-center space-x-4">

              <span
                className="text-gray-700 cursor-pointer hover:text-blue-600 transition"
                onClick={() => router.push(`/user/${session.id}`)}
              >
                Hello, {session.email} 👋
              </span>
              <button
                className="text-red-500 hover:underline"
                onClick={async() => {
                 await fetch(`/api/authentication/logout`, {
                    method: "POST"
                })
                router.reload()
              }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-x-3">
              <button
                onClick={() => {
                  sessionStorage.setItem("redirectPath", window.location.pathname);
                  router.push("/auth/login")
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Login
              </button>
              <button
                onClick={() => router.push("/auth/register")}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 transition"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Welcome to Quiz App 🎉</h2>

        <div className="flex space-x-4">
          <button
            onClick={() => router.push("/quiz/public-quiz")}
            className="px-6 py-3 bg-orange-500 text-white text-lg font-semibold rounded-lg hover:bg-orange-700 transition"
          >
            On-going Quizs
          </button>
          <button
            onClick={() => router.push(`/quiz/presenter`)}
            className="px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Find Persentation
          </button>
          <button
            onClick={() => router.push(`/quiz/user/${session?.id}`)}
            className="px-6 py-3 bg-green-500 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition"
          >
            Find Your Quizs
          </button>
        </div>
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const session = await verifySession(req);
    return { props: { session } };
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      res.setHeader("Set-Cookie", clearSession());
    }
    return { props: { session: null } };
  }
};

export default HomePage;
