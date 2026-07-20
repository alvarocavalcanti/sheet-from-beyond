import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import CharacterSheetsList from './CharacterSheetsList';

const mockGetItems = vi.fn();

// Mock OBR SDK
vi.mock('@owlbear-rodeo/sdk', () => ({
  default: {
    scene: {
      items: {
        onChange: vi.fn(),
        getItems: (...args: any[]) => mockGetItems(...args),
      }
    },
    action: {
      setWidth: vi.fn(),
      setHeight: vi.fn(),
    },
    player: {
      getRole: vi.fn().mockReturnValue('GM'),
    },
    theme: {
      onChange: vi.fn(),
    }
  },
}));

describe('CharacterSheetsList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders empty state when no items returned', async () => {
    mockGetItems.mockResolvedValue([]);
    render(<CharacterSheetsList activeSheetId={null} setActiveSheetId={vi.fn()} />);
    await waitFor(() => {
      expect(screen.getByText(/No character sheets added yet/i)).toBeInTheDocument();
    });
  });

  it('renders a character sheet from item metadata', async () => {
    mockGetItems.mockResolvedValue([
      {
        id: '1',
        name: 'Grog',
        layer: 'CHARACTER',
        metadata: {
          'es.memorablenaton.sheet-from-beyond/metadata': {
            characterSheetURL: 'https://dndbeyond.com/characters/123'
          }
        }
      }
    ]);

    render(<CharacterSheetsList activeSheetId={null} setActiveSheetId={vi.fn()} />);
    
    await waitFor(() => {
      expect(screen.getByText('Grog')).toBeInTheDocument();
    });
  });
});
