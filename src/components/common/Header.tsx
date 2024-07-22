"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ToggleThemeButton from './ToggleThemeButton';
import ModalLogin from '../modals/Login';
import Register from '../modals/Register';
import { getSession, signOut } from 'next-auth/react';
import type { Session } from 'next-auth';
import { useRegister } from '@/hooks/useRegister'; // Certifique-se de usar o caminho correto para o hook

const Header = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session) {
        setSession(session);
      }
      setLoading(false);
    };
    fetchSession();
  }, []);

  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  const handleCloseModal = () => {
    setLoginOpen(false);
    setSignupOpen(false);
  };

  const switchToLogin = () => {
    setSignupOpen(false);
    setLoginOpen(true);
  };

  const switchToSignup = () => {
    setLoginOpen(false);
    setSignupOpen(true);
  };

  const handleLogout = async () => {
    await signOut();
    setSession(null);
  };

  const handleLoginSuccess = async () => {
    const session = await getSession();
    setSession(session);
    setLoginOpen(false);
  };

  const { message, handleSubmit } = useRegister(handleCloseModal, switchToLogin);

  if (loading) return null;

  const isUserLoggedIn = session !== null;
  const defaultAvatar = "https://www.svgrepo.com/show/157840/user.svg";
  const userAvatar = isUserLoggedIn
    ? session?.user?.image || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
    : defaultAvatar;

  return (
    <>
      <header className="navbar h-16 bg-base-200 shadow-lg flex justify-between items-center p-4">
        <div className="flex-1 flex items-center">
          <Link href="/" className="btn btn-ghost normal-case text-xl header-link">
            VIAGENS EM CASA
          </Link>
          <Link href="/marketplace" className="btn btn-ghost normal-case text-xl header-link">
            Marketplace
          </Link>
        </div>
        <div className="flex-none flex items-center">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
              <div className="indicator">
                <span className="icon-[mdi--cart] h-5 w-5 text-base-content"></span>
                <span className="badge badge-sm indicator-item bg-primary text-white">0</span>
              </div>
            </div>
            <div
              tabIndex={0}
              className="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-52 shadow">
              <div className="card-body">
                <span className="text-lg font-bold text-base-content">0 Itens</span>
                <span className="text-info">Subtotal: €0</span>
                <div className="card-actions">
                  <button className="btn btn-primary btn-block">Ver carrinho</button>
                </div>
              </div>
            </div>
          </div>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
              {isUserLoggedIn ? (
                <img alt="User Avatar" src={userAvatar} className="w-10 h-10 rounded-full" />
              ) : (
                <span className="icon-[mdi--user] h-6 w-6 text-base-content"></span>
              )}
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow text-base-content">
              {isUserLoggedIn ? (
                <>
                  <li><a>Perfil</a></li>
                  <li><a onClick={handleLogout}>Logout</a></li>
                  <li className="my-2 border-t border-gray-200"></li>
                  <li>
                    <ToggleThemeButton />
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setLoginOpen(true);
                      }}
                    >
                      Iniciar Sessão
                    </a>
                  </li>
                  <li className="my-2 border-t border-gray-200"></li>
                  <li>
                    <ToggleThemeButton />
                  </li>
                </>
              )}
            </ul>
          </div>

          <ModalLogin
            open={loginOpen}
            handleCloseModal={handleCloseModal}
            switchToSignup={switchToSignup}
            onLoginSuccess={handleLoginSuccess}
          />

          <Register
            open={signupOpen}
            handleCloseModal={handleCloseModal}
            switchToLogin={switchToLogin}
            handleSubmit={handleSubmit}
            message={message}
          />
        </div>
      </header>
    </>
  );
};

export default Header;
