
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import UserProfileMenu from "../auth/UserProfileMenu";
import AuthNav from "./AuthNav";

const NavbarAuth = () => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return session ? <UserProfileMenu /> : <AuthNav />;
};

export default NavbarAuth;
