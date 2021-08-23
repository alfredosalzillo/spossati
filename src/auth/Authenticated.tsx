import React from 'react';
import useSession from '@auth/use-session';

export type AuthenticatedProps = React.PropsWithChildren<{
  fallback?: React.ReactNode,
}>;

const Authenticated: React.FunctionComponent<AuthenticatedProps> = ({
  fallback,
  children,
}) => {
  const session = useSession();
  if (session) return <>{children}</>;
  return <>{fallback}</>;
};

export default Authenticated;
