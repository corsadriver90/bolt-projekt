import React from 'react';
    import { Button } from '@/components/ui/button';
    import { Loader2, ExternalLink, AlertTriangle, ShieldCheck, PackagePlus, PackageSearch, DownloadCloud } from 'lucide-react';

    const ReturnLabelSectionUI = ({
      isLoadingLabel,
      generatedUrls,
      labelError,
      buttonText,
      onGenerateLabelsClick,
      numberOfLabelsToCreate,
      allLabelsInitiallyGenerated 
    }) => {

      if (numberOfLabelsToCreate === 0) {
        return null; 
      }
      
      const someLabelsGeneratedButNotAll = generatedUrls.length > 0 && !allLabelsInitiallyGenerated;
      const mainButtonIcon = allLabelsInitiallyGenerated ? <DownloadCloud className="mr-2 h-4 w-4" /> : (someLabelsGeneratedButNotAll ? <PackageSearch className="mr-2 h-4 w-4" /> : <PackagePlus className="mr-2 h-4 w-4" />);
      let mainButtonText = buttonText;
      if (isLoadingLabel) {
        if (someLabelsGeneratedButNotAll) mainButtonText = "Fehlende Labels werden erstellt...";
        else if (allLabelsInitiallyGenerated) mainButtonText = numberOfLabelsToCreate > 1 ? "Labels werden geöffnet..." : "Label wird geöffnet...";
        else mainButtonText = numberOfLabelsToCreate > 1 ? "Labels werden erstellt..." : "Label wird erstellt...";
      }


      return (
        <div className="p-6 bg-sky-50 rounded-lg border border-sky-200 space-y-4">
          <h3 className="text-lg font-semibold text-sky-700 flex items-center">
            <ShieldCheck className="h-5 w-5 mr-2 text-sky-500" /> 
            {numberOfLabelsToCreate > 1 ? `${numberOfLabelsToCreate} Kostenlose DHL Retourenlabels` : 'Kostenloses DHL Retourenlabel'}
          </h3>
          
          <p className="text-sm text-gray-600">
            Für deine Einsendung kannst du hier {numberOfLabelsToCreate > 1 ? `${numberOfLabelsToCreate} kostenlose DHL Retourenlabels` : 'ein kostenloses DHL Retourenlabel'} erstellen. 
            {numberOfLabelsToCreate > 1 ? ' Die Labels öffnen' : ' Das Label öffnet'} sich dann direkt im Browser.
          </p>

          <Button
            onClick={onGenerateLabelsClick}
            disabled={isLoadingLabel}
            className="w-full md:w-auto bg-sky-500 hover:bg-sky-600 text-white"
          >
            {isLoadingLabel ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : mainButtonIcon}
            {mainButtonText}
          </Button>

          {generatedUrls.length > 0 && (
            <div className="space-y-3 pt-3">
              <p className="text-sm text-gray-600">
                Bereits erstellte Labels ({generatedUrls.length} von {numberOfLabelsToCreate}):
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {generatedUrls.map((url, index) => (
                  url ? (
                    <Button
                      key={index}
                      onClick={() => window.open(url, '_blank')}
                      variant="outline"
                      className="w-full justify-start text-left"
                    >
                      <ExternalLink className="mr-2 h-4 w-4 text-sky-600" />
                      Label {index + 1} öffnen/downloaden
                    </Button>
                  ) : (
                    <div key={index} className="p-2 text-sm text-gray-500 border rounded-md">Label {index+1} noch nicht erstellt oder Fehler.</div>
                  )
                ))}
              </div>
            </div>
          )}
          
          {labelError && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm flex items-center mt-2">
              <AlertTriangle className="h-5 w-5 mr-2 shrink-0" />
              <div>
                <strong>Fehler bei Labelerstellung:</strong> {labelError}
              </div>
            </div>
          )}
        </div>
      );
    };

    export default ReturnLabelSectionUI;