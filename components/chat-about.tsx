import Image from "next/image";
import Link from "next/link";

const ChatAbout = () => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center space-y-5 px-5">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          <span className="text-primary">Welcome</span> to Echo 🎉
        </h1>
        <p className="max-w-lg font-medium">
          🚀 Connect with people globally - login to send
          message! 💬
        </p>
        <div className="flex justify-center">
          {/* <Image
            src="/home-img.svg"
            alt="People chatting"
            width={300}
            height={300}
            priority
            className="object-contain"
          /> */}
        </div>
      </div>
    </div>
  );
};

export default ChatAbout;
