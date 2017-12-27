import { NgModule } from '@angular/core';
import { DragulaModule, DragulaService } from 'ng2-dragula';
import { ClientAppComponent } from './client.component';
import { ChatComponent } from './chat/chat.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { DataTransferService } from './services/dataTransfer.service';
import { UserDataService } from './services/userData.service';
import { MainComponent } from './main/main.component';
import { DrawingComponent } from './drawing/drawing.component';
import { SettingsService } from './services/settings.service';
import { EngineService } from './services/engine.service';
import { HelperService } from './services/helper.service';
import { InventoryPanelComponent } from './inventory-panel/inventory-panel.component';
import { CharacterPanelComponent } from './character-panel/character-panel.component';
import { UiComponent } from './ui/ui.component';
import { UIService } from './services/ui.service';
import { UserInfoComponent } from './user-info/user-info.component';
import { TargetInfoComponent } from './target-info/target-info.component';
import { TargetPanelComponent } from './target-panel/target-panel.component';
import { EditorWindowComponent } from './editor-window/editor-window.component';
import { DialogComponent } from './dialog/dialog.component';

@NgModule({
	declarations: [	ClientAppComponent, 
					ChatComponent,
					CharacterPanelComponent,
					DrawingComponent,
					InventoryPanelComponent,
					LoginComponent,
					MainComponent,
					UiComponent,
					UserInfoComponent,
					TargetInfoComponent,
					TargetPanelComponent,
					EditorWindowComponent,
					DialogComponent],
	bootstrap: [ClientAppComponent],
	imports: [	BrowserModule,
				FormsModule,
				DragulaModule],
	providers: [DataTransferService, 
				UserDataService,
				SettingsService,
				EngineService,
				HelperService,
				UIService]      
})

export class AppModule {
	constructor(chatService: DataTransferService,
				userDataService: UserDataService) {}
}
