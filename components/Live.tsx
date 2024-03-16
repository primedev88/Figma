// collections of all live functionalities
import { useMyPresence, useOthers } from "@/liveblocks.config"
import LiveCursors from "./cursor/LiveCursors"
import { useCallback, useEffect, useState } from "react";
import CursorChat from "./cursor/CursorChat";
import { CursorMode, Reaction } from "@/types/type";
import ReactionSelector from "./reaction/ReactionButton";

const Live = () => {
  const others = useOthers(); //returns all the users currently in the same room
  const [{ cursor },updateMyPresence] = useMyPresence() as any;
  
  const [cursorState, setCursorState] = useState({
    mode: CursorMode.Hidden,
  })

  const [reactions, setReactions] = useState<Reaction[]>([])


  const handlePointerMove = useCallback((event:React.PointerEvent)=>{
    event.preventDefault();

    

    const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
    const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

    updateMyPresence({cursor:{x,y} });
  },[])

  const handlePointerLeave = useCallback((event:React.PointerEvent)=>{
    setCursorState({ mode: CursorMode.Hidden })

    updateMyPresence({cursor: null, message: null });
  },[])

  const handlePointerDown = useCallback((event:React.PointerEvent)=>{
    
    const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
    const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

    updateMyPresence({cursor:{x,y} });
  },[])

  useEffect(()=>{
    const onKeyUp = (e: KeyboardEvent) => {
      if(e.key === '/'){
        setCursorState({
          mode: CursorMode.Chat,
          previousMessage: null,
          message: '',
        })
      } else if(e.key ==='Escape'){
        updateMyPresence({message: ''})
        setCursorState({ mode: CursorMode.Hidden})
      } else if(e.key === 'e'){
        setCursorState({
          mode: CursorMode.ReactionSelector,
        })
      }
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if(e.key ==='/'){
        e.preventDefault();
      }
    }

    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keyup',onKeyUp);
      window.removeEventListener('keydown',onKeyDown);
    }
  },[updateMyPresence]);

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      className="h-[100vh] w-full flex justify-center items-center text-center "
    >
      <h1 className="text-2xl text-white">Liveblocks Figma Clone</h1> 
      <LiveCursors others={others} />
      {cursor && (
        <CursorChat
          cursor={cursor}
          cursorState={cursorState}
          setCursorState={setCursorState}
          updateMyPresence={updateMyPresence}
        />
      )}

      {cursorState.mode === CursorMode.ReactionSelector && (
        <ReactionSelector
          setReaction={(reaction)=>{
            setReactions(reaction);
          }}
        />
      )}
    </div>
  )
}

export default Live