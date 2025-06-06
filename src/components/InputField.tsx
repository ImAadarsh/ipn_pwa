import React from 'react';

import {svg} from '../svg';
import {theme} from '../constants';

type Props = {
  type?: string;
  label?: string;
  value?: string;
  inputType: string;
  placeholder: string;
  autoCapitalize?: string;
  containerStyle?: React.CSSProperties;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const InputField: React.FC<Props> = ({
  inputType,
  placeholder,
  type = 'text',
  containerStyle,
  onChange,
  value,
  label,
}) => {
  return (
    <div
      style={{
        height: 60,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 20,
        paddingTop: 8,
        paddingBottom: 8,
        border: '1px solid #FFFFFF',
        borderRadius: 10,
        backgroundColor: `${'#FFFFFF'}70`,
        boxShadow: '0px 4px 10px rgba(37, 73, 150, 0.05)',
        ...containerStyle,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
        }}
      >
        <span
          className='t12'
          style={{
            marginBottom: 'auto',
            fontFamily: 'var(--font-league-spartan)',
            color: theme.colors.secondaryTextColor,
            fontWeight: 300,
          }}
        >
          {label}
        </span>
        <input
          placeholder={placeholder}
          maxLength={50}
          type={type}
          style={{
            display: 'flex',
            flex: 1,
            width: '100%',
            height: '100%',
            padding: 0,
            margin: 0,
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            fontSize: 16,
            color: theme.colors.mainColor,
          }}
          value={value}
          onChange={onChange}
        />
      </div>

      <div className='clickable' style={{padding: '10px 19px'}}>
        {inputType === 'email' && <svg.CheckSvg />}
        {inputType === 'password' && <svg.EyeOffSvg />}
        {inputType === 'card number' && <svg.InputCameraSvg />}
      </div>
    </div>
  );
};
