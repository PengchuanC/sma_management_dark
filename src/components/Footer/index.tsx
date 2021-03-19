import { DefaultFooter } from '@ant-design/pro-layout';

export default () => (
  <DefaultFooter
    copyright="2020 Nomura Orient International Securities Co.,Ltd. ALL RIGHTS RESERVED."
    links={[
      {
        key: 'nomuraoi-sec',
        title: '野村东方国际证券',
        href: 'https://www.nomuraoi-sec.com',
        blankTarget: true,
      },
      {
        key: 'sma-service',
        title: 'SMA客户服务平台',
        href: 'https:/sma.nomuraoi-sec.com',
        blankTarget: true,
      },
    ]}
  />
);
