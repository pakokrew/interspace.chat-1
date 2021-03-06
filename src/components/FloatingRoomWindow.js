import React, { useEffect, useContext, useReducer } from "react";
import styled from "styled-components";
import { Rnd } from "react-rnd";

import { FloatingSpaceContext } from "../contexts/FloatingSpaceContext";
import LoftRadioInstance from "./integrations/LoftRadioInstance";
import ChatInstance from "./integrations/ChatInstance";
import CalendarInstance from "./integrations/CalendarInstance";
import RoomInstance from "./RoomInstance";
import { RoomNames } from "../utils/constants";

const width = window.innerWidth / 2;
const height = window.innerHeight / 2;

const SpaceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const SpaceHeaderElement = styled.div`
  margin: 0.5rem;
`;
const SpaceContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
`;

const SpaceContent = styled.div`
  width: 100%;
  flex: 1;
`;

const spaceContainerStyle = {
  padding: "15px",
  paddingTop: "0px",
  backgroundColor: "#36393ecc",
  // backdropFilter: "blur(4px)",
  borderRadius: "10px",
  cursor: "all-scroll",
  pointerEvents: "all",
  boxShadow:
    "0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)",
  "&:active iframe": {
    pointerEvents: "none"
  }
};

const Closer = styled.div`
  opacity: 0.7;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
  &::before {
    content: "×"; // here is your X(cross) sign.
    color: #fff;
    font-family: Arial, sans-serif;
    font-weight: bold;
    font-size: 30px;
  }
`;

function getFloatingRoomWindow(windowKey) {
  if (windowKey === "loft.radio") {
    return <LoftRadioInstance />;
  } else if (RoomNames.indexOf(windowKey) > -1) {
    return <RoomInstance space={windowKey} />;
  } else if (windowKey === "discord chat") {
    return <ChatInstance />;
  } else if (windowKey === "calendar") {
    return <CalendarInstance />;
  } else if (windowKey === null) {
    return null;
  }
}

function zIndexesReducer(state, action) {
  return {
    ...state,
    [action.key]: action.value
  };
}

function FloatingRoomWindow() {
  const { currentFloatingSpaces, closeFloatingSpace } = useContext(
    FloatingSpaceContext
  );

  const [zIndexes, setZIndexes] = useReducer(zIndexesReducer, {});
  const maxZ = Object.values(zIndexes).reduce(
    (acc, el) => Math.max(acc, el),
    1
  );

  useEffect(() => {
    let tempMax = maxZ;
    currentFloatingSpaces.forEach(space => {
      if (!zIndexes[space]) {
        setZIndexes({ key: space, value: ++tempMax });
      }
    });
  }, [currentFloatingSpaces, maxZ, zIndexes]);

  function setWindowFocus(windowKey) {
    setZIndexes({ key: windowKey, value: maxZ + 1 });
  }

  const setStartingCoordinatesX = windowKey => {
    let windowOriginX = 20;
    if (windowKey === "discord chat") {
      windowOriginX = width;
    } else if (windowKey === "calendar") {
      windowOriginX = width;
    }
    return windowOriginX;
  };
  const setStartingCoordinatesY = windowKey => {
    let windowOriginY = 40;
    if (windowKey === "discord chat") {
      windowOriginY = 40;
    } else if (windowKey === "calendar") {
      windowOriginY = height / 2;
    }
    return windowOriginY;
  };

  return currentFloatingSpaces.map(windowKey => (
    <Rnd
      key={windowKey}
      default={{
        x: setStartingCoordinatesX(windowKey),
        y: setStartingCoordinatesY(windowKey),
        width: width - 20,
        height
      }}
      style={{
        ...spaceContainerStyle,
        zIndex: zIndexes[windowKey] || 1
      }}
      onDragStart={() => setWindowFocus(windowKey)}
    >
      <SpaceContainer>
        <SpaceHeader>
          <SpaceHeaderElement onClick={() => closeFloatingSpace(windowKey)}>
            <Closer />
          </SpaceHeaderElement>
          <SpaceHeaderElement>{windowKey}</SpaceHeaderElement>
          <SpaceHeaderElement></SpaceHeaderElement>
        </SpaceHeader>
        <SpaceContent>{getFloatingRoomWindow(windowKey)}</SpaceContent>
      </SpaceContainer>
    </Rnd>
  ));
}

export default FloatingRoomWindow;
