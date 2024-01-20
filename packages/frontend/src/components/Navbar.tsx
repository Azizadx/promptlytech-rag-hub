import Link from 'next/link';
import { Button, buttonVariants } from './ui/button';
import Image from 'next/image';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import UserAccountnav from './UserAccountnav';

const Navbar = async () => {
  const session = await getServerSession(authOptions);
  return (
    <div className=' bg-white py-2 border-b border-s-zinc-200 fixed w-full z-10 top-0'>
      <div className='container flex items-center justify-between'>
        <Link href='/'>
          <Image src='/logo.svg' alt='Logo' width={150} height={150} />
        </Link>
        <div className='flex space-x-4'>
          {session?.user ? (
            <UserAccountnav />
          ) : (
            <>
              <Link className = { buttonVariants() }  href = '/sign-in'>
                Sign in
              </Link>
              <Link className={buttonVariants()} href='/sign-up'>
                Sign up
              </Link>
            </>
          )}
          <Link className={buttonVariants()} href='https://www.showtimestrategies.net/'>
            About
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
