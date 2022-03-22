import { Storefront } from '@oyster/common';
import { Layout, notification } from 'antd';
import React, { ReactNode, useEffect, useState } from 'react';
import { AppBar } from '../AppBar';
import { Player } from '../Player';
import { AuctionViewItem } from '../../../../common/src/models/metaplex/index'; 
//import { AuctionItem, AuctionView } from '../../views/auction';
//import { AuctionCard } from '../AuctionCard';

const { Content } = Layout;


export const AppLayout = React.memo(function AppLayout(props: {
  children?: ReactNode;
  storefront?: Storefront;
  item: AuctionViewItem;
  active?: boolean;
}) {
  useEffect(() => {
    notification.config({
      placement: 'bottomLeft',
      duration: 15,
      maxCount: 3,
    });
  }, []);


  

  return (
    <div className="app-wrapper">
      <AppBar />
      <Content id="metaplex-layout-content">{props.children}
      <div>
        {/*<Player 
        />*/}
      </div>
      </Content>
    </div>
  );
});
