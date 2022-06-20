import React, { Children, ReactElement } from 'react';
import { useEffect, useState } from 'react';

const useChild = <T,>(
  children: ReactElement | ReactElement[],
  childCandidate: any
): [boolean, T] => {
  const [matchedChild, setMatchedChild] = useState(null);
  const [matched, setMatched] = useState(false);

  useEffect(() => {
    Children.forEach(children, (child) => {
      if (child.type === childCandidate) {
        setMatchedChild(child);
        setMatched(true);
      }
    });
  }, [children]);

  return [matched, matchedChild];
};

export default useChild;
