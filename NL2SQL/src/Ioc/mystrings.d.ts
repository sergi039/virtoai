interface IVirtoStrings {
    btnAdd: string;
    btnDelete: string;
    btnCancel: string;
    btnClose: string;
    newChat: string;
    footerTitle: string;
    syncSuccess: string;
    syncError: string;
    loading: string;

    InfoPanel: {
        loading: string;
        noSyncData: string;
        noData: string;
        records: string;
        recordsShort: string;
        recordsK: string;
        recordsM: string;
    };

    Chat: {
        model: string;
        history: string;
        footerTitle: string;
        shown: string;
        sqlSavedSuccess: string;
        sqlSavedFailed: string;
        feedbackSaveSuccess: string;
        feedbackSaveFailed: string;
        notAvailable: string;
        from: string;
        noResultsFound: string;
        invalidResponse: string;
        inputPlaceholder: string;
        exampleTitle: string;
        deleteChatConfirmation: string;
        voiceInput: string;
        sendMessage: string;
        cancelVoiceInput: string;
        confirmVoiceInput: string;
        listening: string;
        textCopied: string;
        microphoneAccessDenied: string;
        speechConfigNotAvailable: string;
        recognitionError: string;
        recognitionStartError: string;
        errorStartingRecognition: string;
        recognizedText: string;
        detectedLanguage: string;
        couldNotParseLanguageDetection: string;
        unknown: string;
        selectModels: string;
        allModels: string;
        processing: string;
        loading: string;
        noModelSelected: string;
        noAIResponse: string;
        failedToGetResponse: string;
        failedToUpdateMessage: string;
        syntaxError: string;
        generationError: string;
        unclearRequest: string;
        clarificationQuestions: string;
        suggestedOptions: string;
        
        dateCategories: {
            today: string;
            yesterday: string;
            lastSevenDays: string;
            months: string[];
        };

        ToolTips: {
            chatTooltipTitle: string;
            searchUsersPlaceholder: string;
            noUsersAvailable: string;
            noUsersFound: string;
            selectedUsers: string;
            chatHistoryManageUsers: string;
            chatHistoryManageUsersTooltip: string;
            chatHistoryManageUsersTooltipSave: string;
            chatHistoryManageUsersTooltipCancel: string;
            addPeople: string;
            addPeopleSearch: string;
            startTypingToSearch: string;
            youLabel: string;
            leave: string;
        }

        UserManagement: {
            userAddedSuccess: string;
            userAddedError: string;
            userRemovedSuccess: string;
            userRemovedError: string;
        }

        ContextMenu: {
            copyValue: string;
            openUrl: string;
            inspectField: string;
            tableInfo: string;
            valueCopied: string;
            urlOpened: string;
            urlGenerationFailed: string;
            fieldInfo: string;
            tableColumnInfo: string;
            emptyFieldError: string;
        }
    };

    UserOptions: {
        settings: string;
        rules: string;
        logout: string;
        contact: string;
    },

    Auth: {
        redirectingToLogin: string;
    },

    AIModel: {
        chatGPT: string;
        all: string;
        chatClaude: string;
        auto: string;
        local: string;
        agent: string;
        claude: string;
        gemini: string;
    },

    ServiceNames: {
        employee: string;
        sale: string;
        product: string;
        customer: string;
        revenue: string;
    },

    SettingsPanel: {
        loading: string;
        saveSuccess: string;
        saveError: string;
        availableServices: string;
        selectServices: string;
        tableSelection: string;
        selectTables: string;
        serviceConfig: string;
        mainSetting: string;
        selectServiceConfig: string;
        disabled: string;
        save: string;
        cancel: string;
        databaseTitle: string;

        apollo: {
            title: string;
            setup: string;
            domain: string;
            emailDomain: string;
            name: string;
            limit: string;
            timeout: string;
            duration: string;
            syncButton: string;
            syncDescription: string;
            matchFreshdesk: string;
            matchPipedrive: string;
        };

        ortto: {
            title: string;
            setup: string;
            importData: string;
            limit: string;
            timeout: string;
            duration: string;
            syncButton: string;
            syncDescription: string;
            noLimit: string;
            matchFreshdesk: string;
            matchPipedrive: string;
        };

        freshdesk: {
            title: string;
            entities: string;
            allEntities: string;
            ticketsOnly: string;
            contactsOnly: string;
            companiesOnly: string;
            conversations: string;
            sinceDate: string;
            untilDate: string;
            timeout: string;
            duration: string;
            syncButton: string;
            syncDescription: string;
            selectDate: string;
            batchSize: string;
            insecure: string;
            ticketId: string;
            parallelThreads: string;
        };

        pipedrive: {
            title: string;
            setup: string;
            fullImport: string;
            match: string;
            timeout: string;
            contacts: string;
            duration: string;
            syncButton: string;
            syncDescription: string;
            entities: string;
            entitiesAll: string;
            entitiesDeals: string;
            entitiesActivities: string;
            entitiesPersons: string;
            entitiesOrganizations: string;
            entitiesProducts: string;
            entitiesNotes: string;
        };

        rules: {
            title: string;
            addRule: string;
            editRule: string;
            deleteRule: string;
            noRules: string;
            ruleAdded: string;
            ruleUpdated: string;
            ruleDeleted: string;
            previousPage: string;
            nextPage: string;
            pageInfo: string;
            enterRuleText: string;
            save: string;
            cancel: string;
            autoGenerated: string;
            loadingRules: string;
            failedToLoadRules: string;
            failedToSaveRule: string;
            failedToUpdateRule: string;
            failedToDeleteRule: string;
        };

        relations: {
            title: string;
            relationTypeToggle: string;
            implicitRelation: string;
            explicitRelation: string;
            implicitRelationCreatedSuccess: string;
            implicitRelationCreationError: string;
            ruleCreationError: string;
            relationNotFound: string;
            implicitRelationDeletedSuccess: string;
            implicitRelationDeletionError: string;
            existingRelations: string;
            createNewRelation: string;
            sourceTable: string;
            jointionTable: string;
            rightJoin: string;
            leftJoin: string;
            fullJoin: string;
            innerJoin: string;
            crossJoin: string;
            sourceService: string;
            sourceTableLabel: string;
            sourceColumn: string;
            relationType: string;
            targetTable: string;
            targetService: string;
            targetTableLabel: string;
            targetColumn: string;
            createRelation: string;
            cancel: string;
            deleteRelation: string;
            noRelationsFound: string;
            fillAllFields: string;
            relationCreatedSuccess: string;
            relationCreationError: string;
            creating: string;
            oneToOne: string;
            oneToMany: string;
            manyToMany: string;
            relationAlreadyExists: string;
            relationDeletedSuccess: string;
            relationDeletionError: string;
            selectService: string;
            selectTable: string;
            selectColumn: string;
            existingRelationsFor: string;
            relationInfo: string;
            actions: string;
            relationsInfoTab: string;
            createRelationTab: string;
            visualDiagramTab: string;
            onUpdateAction: string;
            onDeleteAction: string;
            noRelationsFoundForDiagram: string;
            selectTableForDiagram: string;
            explicitRelations: string;
            implicitRelations: string;
            noExplicitRelationsFound: string;
            noImplicitRelationsFound: string;
        };

        FieldEditor: {
            fieldNameLabel: string;
            displayNameLabel: string;
            displayNamePlaceholder: string;
            displayNameDescription: string;
            dataTypeLabel: string;
            defaultValueLabel: string;
            precisionLabel: string;
            scaleLabel: string;
            requiredLabel: string;
            primaryKeyLabel: string;
            uniqueConstraintLabel: string;
            errorFieldNameExists: string;
            scalePlaceholder: string;
            hiddenFieldLabel: string;
            redirectUrlLabel: string;
            redirectUrlPlaceholder: string;
            redirectUrlDescription: string;
            contextMenuItemNameDescription: string;
            aiContextGenerationLabel: string;
            contextMenuTitle: string;
            addContextMenuItem: string;
            contextMenuItemName: string;
            contextMenuItemNamePlaceholder: string;
            noContextMenuItems: string;
            deleteContextMenuItem: string;
            editContextMenuItem: string;
        };

        TablesSection: {
            sectionTitle: string;
            loadingMessage: string;
            addTable: string;
            editTable: string;
            deleteTable: string;
            manageRelations: string;
            showTableInfo: string;
            tableNameColumn: string;
            fieldsCountColumn: string;
            statusColumn: string;
            activeTablesCount: string;
            inactiveTablesCount: string;
            totalTablesCount: string;
            activeStatus: string;
            inactiveStatus: string;
            relationsTitle: string;
        };

        constructor: {
            nameTable: string;
            errorTableNameExists: string;
            activeTableTitle: string;
            activeTableLabel: string;
        }

        FieldsSection: {
            sectionTitle: string;
            addField: string;
            editField: string;
            deleteField: string;
            fieldName: string;
            displayName: string;
            type: string;
            required: string;
            primary: string;
            unique: string;
            hidden: string;
            fieldsInTable: string;
        };
    };
}

interface IGlobal extends Window {
    VirtoStrings?: IVirtoStrings;
}

declare module 'VirtoStrings' {
    const strings: IVirtoStrings;
    export = strings;
}