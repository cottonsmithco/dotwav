import React from 'react';
import { Card, Typography, Button, Alert } from 'antd';
import { TwitterOutlined } from '@ant-design/icons';
import { StorefrontSocialInfo } from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';
import { Artist } from '../../types';
import { shortenAddress } from '@oyster/common';
import { MetaAvatar } from '../MetaAvatar';

export const ArtistCard = ({
  artist,
  twitterVerification,
  ownerAddress,
  headingText,
}: /* active, */
{
  artist: Artist;
  active: boolean;
  twitterVerification?: string;
  social?: StorefrontSocialInfo;
  ownerAddress?: string;
  headingText: string;
}) => {
  const wallet = useWallet();
  return (
    <Card
      className="metaplex-round-corners"
      hoverable
      cover={
        <div className="metaplex-artist-card-cover">
          {artist.background ? (
            <img
              className="metaplex-artist-card-background"
              src={artist.background}
            />
          ) : null}
        </div>
      }
      bordered={false}
    >
      <div className="content-wrapper">
        <MetaAvatar creators={[artist]} size={40} />
        {artist.name || shortenAddress(artist.address || '')}
      </div>
      {artist.about && <div className="about">{artist.about}</div>}
      <div id="metaplex-banner-hero">
        <h1>{headingText}</h1>
        {/*subHeadingText && <Text>{subHeadingText}</Text>*/}
        {twitterVerification ? (
          <a
            href={'https://twitter.com/' + twitterVerification}
            target="_blank"
            rel="noreferrer"
            className="twitter-button"
          >
            {' '}
            <Button shape="round" icon={<TwitterOutlined />}>
              @{twitterVerification}
            </Button>
          </a>
        ) : (
          wallet.connected &&
          ownerAddress === wallet.publicKey?.toBase58() && (
            <div className="metaplex-margin-top-8">
              <Alert
                className="metaplex-flex-align-items-center metaplex-align-left"
                message="Connect your Twitter account"
                description={
                  <>
                    Help protect collectors by connecting your store to a
                    Twitter page on{' '}
                    <a
                      href="https://naming.bonfida.org/#/twitter-registration"
                      rel="noreferrer"
                      target="_blank"
                    >
                      Bonfida
                    </a>
                  </>
                }
                icon={<TwitterOutlined />}
                showIcon
              />
            </div>
          )
        )}
      </div>
    </Card>
  );
};
