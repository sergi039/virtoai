export enum CascadeType {
    NONE = 'NONE',
    CASCADE = 'CASCADE',
    RESTRICT = 'RESTRICT',
    SET_NULL = 'SET_NULL',
    SET_DEFAULT = 'SET_DEFAULT',
}

export const getCascadeDisplayName = (cascadeType: CascadeType): string => {
    switch (cascadeType) {
        case CascadeType.NONE:
            return 'No Action';
        case CascadeType.CASCADE:
            return 'CASCADE';
        case CascadeType.RESTRICT:
            return 'RESTRICT';
        case CascadeType.SET_NULL:
            return 'SET NULL';
        case CascadeType.SET_DEFAULT:
            return 'SET DEFAULT';
        default:
            return 'No Action';
    }
};

export const getCascadeSQL = (cascadeType: CascadeType): string => {
    switch (cascadeType) {
        case CascadeType.CASCADE:
            return 'CASCADE';
        case CascadeType.RESTRICT:
            return 'RESTRICT';
        case CascadeType.SET_NULL:
            return 'SET NULL';
        case CascadeType.SET_DEFAULT:
            return 'SET DEFAULT';
        case CascadeType.NONE:
        default:
            return '';
    }
};
