import React from 'react';
import parse from 'autosuggest-highlight/parse';

export type HighlightedTextProps = {
  text: string,
  matches?: Array<[number, number]>,
};
const HighlightedText: React.FunctionComponent<HighlightedTextProps> = ({
  text,
  matches = [],
}) => {
  const parts = parse(text, matches);
  return (
    <>
      {/* eslint-disable-next-line @typescript-eslint/no-shadow */}
      {parts.map(({ highlight, text }, index) => {
        if (highlight) {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <strong key={index}>
              {text}
            </strong>
          );
        }
        return (
          // eslint-disable-next-line react/no-array-index-key
          <span key={index}>
            {text}
          </span>
        );
      })}
    </>
  );
};

export default HighlightedText;
