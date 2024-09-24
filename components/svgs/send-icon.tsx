import * as React from "react";
import { SVGProps } from "react";

const SendIcon = ({ fill, ...props }: SVGProps<SVGSVGElement> & { fill?: string }) => (
  <svg viewBox="1849.4 976.9 28.2 28.2" {...props}>
    <path
      fill={fill || 'currentColor'} 
      d="m1851.886 977.131 24.902 12.6c.804.407 1.094 1.33.647 2.064a1.6 1.6 0 0 1-.647.59l-24.902 12.599c-.805.407-1.82.143-2.266-.59-.138-.225-.21-.373-.21-.63v-9.883l15.53-2.823-15.53-2.824v-9.776c0-.838.746-1.518 1.667-1.518.283 0 .561.066.81.191Z"
    />
  </svg>
);

export default SendIcon;
