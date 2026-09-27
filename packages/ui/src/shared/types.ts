export interface EmailsDirectory {
  absolutePath: string;
  relativePath: string;
  directoryName: string;
  emailFilenames: string[];
  subDirectories: EmailsDirectory[];
}

export interface ErrorObject {
  name: string;
  message: string;
  stack: string | undefined;
  cause?: ErrorObject;
}

export interface RenderedEmailMetadata {
  /** The props this render used, the given ones or the email's `PreviewProps`. */
  previewProps: Record<string, unknown>;
  markup: string;
  prettyMarkup: string;
  plainText: string;
  /** The source code of the email file. */
  source: string;
  basename: string;
  extname: string;
}

export type EmailRenderingResult =
  | RenderedEmailMetadata
  | {
      error: ErrorObject;
    };

export interface HotReloadChange {
  event: 'add' | 'addDir' | 'change' | 'unlink' | 'unlinkDir';
  /** Relative to the emails directory. */
  filename: string;
}

/** What the preview app knows about the project it previews. */
export interface PreviewConfig {
  mode: 'development' | 'static';
  version: string;
  emailsDirectoryName: string;
  workspaceId: string;
  hasResendApiKey: boolean;
  /**
   * Email clients compatibility is checked against. When empty: Gmail, Apple
   * Mail, Outlook and Yahoo.
   */
  compatibilityClients: string[];
}

// The toolbar's checks: linting, compatibility, spam scoring and the Resend
// integration.

/** Where an element starts in the pretty markup. */
export interface CodeLocation {
  line: number;
  column: number;
}

export type LinkCheck = { passed: boolean } & (
  | {
      type: 'fetch_attempt';
      metadata: {
        fetchStatusCode: number | undefined;
      };
    }
  | {
      type: 'syntax';
    }
  | {
      type: 'security';
    }
);

export interface LinkCheckingResult {
  status: 'success' | 'warning' | 'error';
  link: string;
  codeLocation: CodeLocation;
  checks: LinkCheck[];
}

export type ImageCheck = { passed: boolean } & (
  | {
      type: 'accessibility';
      metadata: {
        alt: string | undefined;
      };
    }
  | {
      type: 'fetch_attempt';
      metadata: {
        fetchStatusCode: number | undefined;
      };
    }
  | {
      type: 'image_size';
      metadata: {
        byteCount: number | undefined;
      };
    }
  | {
      type: 'syntax';
    }
  | {
      type: 'security';
    }
);

export interface ImageCheckingResult {
  status: 'success' | 'warning' | 'error';
  source: string;
  codeLocation: CodeLocation;
  checks: ImageCheck[];
}

export type LintingRow =
  | {
      source: 'image';
      result: ImageCheckingResult;
    }
  | {
      source: 'link';
      result: LinkCheckingResult;
    };

/** The email clients in Can I Email's data. */
export type EmailClient =
  | 'gmail'
  | 'outlook'
  | 'yahoo'
  | 'apple-mail'
  | 'aol'
  | 'thunderbird'
  | 'microsoft'
  | 'samsung-email'
  | 'sfr'
  | 'orange'
  | 'protonmail'
  | 'hey'
  | 'mail-ru'
  | 'fastmail'
  | 'laposte'
  | 't-online-de'
  | 'free-fr'
  | 'gmx'
  | 'web-de'
  | 'ionos-1and1'
  | 'rainloop'
  | 'wp-pl';

export type EmailClientPlatform =
  | 'desktop-app'
  | 'desktop-webmail'
  | 'mobile-webmail'
  | 'webmail'
  | 'ios'
  | 'android'
  | 'windows'
  | 'macos'
  | 'windows-mail'
  | 'outlook-com';

export type SupportEntryCategory = 'html' | 'css' | 'image' | 'others';

interface SupportEntryBase {
  slug: string;
  title: string;
  description: string | null;
  url: string;
  category: SupportEntryCategory;
  tags: string[];
  keywords: string | null;
  last_test_date: string;
  test_url: string;
  test_results_url: string | null;
  stats: Partial<
    Record<
      EmailClient,
      Partial<
        Record<
          EmailClientPlatform,
          /*
            Each of these records has a single key, as Can I Email's data is
            ordered by version, like:

            [
              { "1.0": "u" },
              { "2.0": "y" },
              { "3.0": "p #1" },
            ]
          */
          Record</* version */ string, string>[]
        >
      >
    >
  >;
  notes: string | null;
  notes_by_num: Record<number, string> | null;
}

/** A feature of Can I Email, or one curated by React Email. */
export type SupportEntry =
  | (SupportEntryBase & {
      /**
       * Can I Email's entries are generated and predate this discriminator,
       * so the missing value is treated as `caniemail`.
       */
      source?: 'caniemail';
    })
  | (SupportEntryBase & {
      source: 'react-email';
    });

export type DetailedSupportStatus =
  | {
      status: 'success';
    }
  | {
      status: 'error';
    }
  | {
      status: 'warning';
      notes: string;
    };

export type SupportStatus = DetailedSupportStatus['status'];

export interface EmailClientStats {
  status: SupportStatus;
  perPlatform: Partial<Record<EmailClientPlatform, DetailedSupportStatus>>;
}

export interface CompatibilityStats {
  status: SupportStatus;
  perEmailClient: Partial<Record<EmailClient, EmailClientStats>>;
}

/** A position in the pretty markup: 1-based line, 0-based column. */
export interface SourcePosition {
  line: number;
  column: number;
  index: number;
}

export interface SourceLocation {
  start: SourcePosition;
  end: SourcePosition;
}

export interface CompatibilityCheckingResult {
  /** Where the feature is first used in the pretty markup. */
  location: SourceLocation;
  /** The lines of the pretty markup around the feature. */
  source: string;
  entry: SupportEntry;
  status: SupportStatus;
  statsPerEmailClient: CompatibilityStats['perEmailClient'];
}

export interface SpamCheckingResult {
  checks: {
    name: string;
    description: string;
    points: number;
  }[];
  isSpam: boolean;
  points: number;
}

export type UploadTemplateResult =
  | { name: string; status: 'failed' }
  | { name: string; status: 'succeeded'; id: string };

/** The toolbar's results for an email, which `email build` precomputes. */
export interface ToolbarData {
  lintingRows: LintingRow[];
  compatibilityResults: CompatibilityCheckingResult[];
  /** Missing when the spam check couldn't run during the build. */
  spamCheckingResult?: SpamCheckingResult;
}
