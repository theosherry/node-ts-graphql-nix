# let theoPkgs = builtins.fetchGit {
  #   url = "https://github.com/theosherry/nix-files.git";
  #   ref = "master";
  # };
  let
    theoPkgs = import ~/Work/nix-files;
    nixpkgs = theoPkgs.nixpkgs;
    theoEmacsPackages = theoPkgs.theoEmacsPackages;
    theoNixLib = theoPkgs.theoNixLib;
    extensionBaseShell = (theoNixLib.BaseShell {
      onEnter = ''
        export THEO_EMACS_PRISMA_ENABLED="true"
        npm install
      '';
      onExit = ''
        unset THEO_EMACS_PRISMA_ENABLED 
      '';
      pkgs = [nixpkgs.sqlite];
      extraEpkgs = (_ : [theoEmacsPackages.emacs-prisma-mode]);
    });
  in
  (theoNixLib.extendDevEnv {
    devEnv = theoPkgs.theoNodeTSDev;
    inherit extensionBaseShell;
  }).withEmacs
