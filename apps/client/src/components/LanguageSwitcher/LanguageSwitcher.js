import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const LanguageSelector = styled.div`
  position: relative;
  display: inline-block;
`;

const LanguageButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  background: transparent;
  border: 1px solid #2c5530;
  border-radius: 8px;
  color: #2c5530;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  transition: all 0.3s ease;
  min-width: 50px;
  min-height: 36px;

  &:hover {
    background: #eef4ef;
    border-color: #2c5530;
  }

  /* Responsive styles for mobile */
  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 11px;
    border-radius: 6px;
    min-width: 42px;
    min-height: 30px;
  }

  @media (max-width: 480px) {
    padding: 5px 10px;
    font-size: 10px;
    min-width: 38px;
    min-height: 26px;
  }

  @media (max-width: 375px) {
    padding: 4px 8px;
    font-size: 9px;
    min-width: 34px;
    min-height: 24px;
  }
`;

const LanguageDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  min-width: 150px;
  z-index: 1000;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transform: translateY(${props => props.$isOpen ? 0 : '-10px'});
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    min-width: 130px;
    border-radius: 6px;
    top: calc(100% + 6px);
  }

  @media (max-width: 480px) {
    min-width: 120px;
    border-radius: 6px;
  }
`;

const LanguageOption = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: ${props => props.$isActive ? '#f0f0f0' : 'white'};
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: background 0.2s ease;
  display: flex;
  align-items: center;
  gap: 10px;

  &:hover {
    background: #f5f5f5;
  }

  .flag {
    font-size: 20px;
    font-family: "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", "Apple Color Emoji", sans-serif;
  }

  .lang-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .lang-code {
    font-weight: 600;
    text-transform: uppercase;
  }

  .lang-name {
    font-size: 12px;
    color: #666;
  }

  @media (max-width: 768px) {
    padding: 10px 12px;
    font-size: 13px;
    gap: 8px;

    .flag {
      font-size: 18px;
    }

    .lang-code {
      font-size: 12px;
    }

    .lang-name {
      font-size: 11px;
    }
  }

  @media (max-width: 480px) {
    padding: 8px 10px;
    font-size: 12px;
    gap: 6px;

    .flag {
      font-size: 16px;
    }

    .lang-code {
      font-size: 11px;
    }

    .lang-name {
      font-size: 10px;
    }
  }
`;

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const selectorRef = React.useRef(null);

  const currentLangCode = i18n.language ? i18n.language.split('-')[0].toLowerCase() : 'fr';
  const currentLanguage = languages.find(lang => lang.code === currentLangCode) || languages[1];

  const changeLanguage = (langCode) => {
    const currentPath = location.pathname;
    const pathParts = currentPath.split('/').filter(Boolean);

    // Remove current language prefix if exists
    const languageCodes = languages.map(l => l.code);
    if (languageCodes.includes(pathParts[0])) {
      pathParts.shift();
    }

    // Build new path with new language
    const newPath = `/${langCode}${pathParts.length > 0 ? '/' + pathParts.join('/') : ''}`;

    i18n.changeLanguage(langCode);
    navigate(newPath);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <LanguageSelector ref={selectorRef}>
      <LanguageButton onClick={() => setIsOpen(!isOpen)}>
        {currentLanguage.code}
      </LanguageButton>

      <LanguageDropdown $isOpen={isOpen}>
        {languages.map(lang => (
          <LanguageOption
            key={lang.code}
            $isActive={lang.code === currentLangCode}
            onClick={() => changeLanguage(lang.code)}
          >
            <span className="flag">{lang.flag}</span>
            <div className="lang-info">
              <span className="lang-code">{lang.code}</span>
              <span className="lang-name">{lang.name}</span>
            </div>
          </LanguageOption>
        ))}
      </LanguageDropdown>
    </LanguageSelector>
  );
};

export default LanguageSwitcher;
