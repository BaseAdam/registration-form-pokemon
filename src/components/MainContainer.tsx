import styled from '@emotion/styled';

import { breakpoints } from '@/utils/breakpoints';

const MainContainer = styled.main`
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 544px;
  padding: 0 1rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  @media (min-width: ${breakpoints.sm}) {
    padding: 0;
  }
`;

export default MainContainer;
