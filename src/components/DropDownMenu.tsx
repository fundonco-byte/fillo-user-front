import type { MotionProps, Variants } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, MenuItem } from "./Menu";

const menu = {
  closed: {
    scale: 0,
    transition: {
      delay: 0.15,
    },
  },
  open: {
    scale: 1,
    transition: {
      type: "spring",
      duration: 0.4,
      delayChildren: 0.2,
      staggerChildren: 0.05,
    },
  },
} satisfies Variants;

const item = {
  variants: {
    closed: { x: -16, opacity: 0 },
    open: { x: 0, opacity: 1 },
  },
  transition: { opacity: { duration: 0.2 } },
} satisfies MotionProps;

export default function DropDownMenu({
  onLogout,
  profileImage,
}: {
  onLogout: () => void;
  profileImage: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleMyPageClick = () => {
    router.push("/my-page");
    setOpen(false);
  };

  const handleCreateMeetingClick = () => {
    router.push("/meetings/create");
    setOpen(false);
  };

  const handleLogoutClick = () => {
    onLogout();
    setOpen(false);
  };

  return (
    <Menu
      profileImage={profileImage}
      open={open}
      setOpen={setOpen}
      animate={open ? "open" : "closed"}
      initial="closed"
      exit="closed"
      variants={menu}
    >
      <MenuItem {...item} onClick={handleMyPageClick}>
        마이페이지
      </MenuItem>
      {/* <MenuItem {...item} onClick={handleCreateMeetingClick}>
        모임 생성
      </MenuItem> */}
      <MenuItem {...item} onClick={handleLogoutClick}>
        로그아웃
      </MenuItem>
    </Menu>
  );
}
