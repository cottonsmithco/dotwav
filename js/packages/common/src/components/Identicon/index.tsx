import React, { CSSProperties, useEffect, useMemo, useRef } from 'react';

import { PublicKey } from '@solana/web3.js';

export const Identicon = ({
  size,
  address,
  alt,
}: {
  size?: CSSProperties['width'];
  address?: string | PublicKey;
  alt?: string;
}) => {
  const pubkey = typeof address === 'string' ? new PublicKey(address) : address;
  const ref = useRef<HTMLDivElement>(null);


    // There's no need for jazzicon to dictate the element size, this allows
    // auto-scaling the element and its contents
  

  return (
    <div
      title={alt}
      ref={ref}
      style={size ? { width: size, height: size } : {}}
    />
  );
};
