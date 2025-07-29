import { useQuery } from '@apollo/client';
import { Typography } from 'antd';
const { Text } = Typography;

import { VERSION_QUERY } from '../Dashboard/queries';

function Version() {
  const { data: versionData } = useQuery(VERSION_QUERY);

  if (!versionData?.version?.serverVersion) {
    return null;
  }

  const { serverVersion, buildVersion } = versionData.version;

  return (
    <Text
      style={{
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        fontSize: '12px',
        color: '#666',
        opacity: 0.7,
      }}
    >
      v{serverVersion} (build: {buildVersion})
    </Text>
  );
}

export { Version };